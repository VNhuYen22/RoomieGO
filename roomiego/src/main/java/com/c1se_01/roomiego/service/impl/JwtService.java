package com.c1se_01.roomiego.service.impl;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

@Component
public class JwtService {

    private SecretKey Key;
    private  static  final long EXPIRATION_TIME = 86400000;  //24 hours

    public JwtService(){
        String secreteString = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
        byte[] keyBytes = Base64.getDecoder().decode(secreteString.getBytes(StandardCharsets.UTF_8));
        this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    public String generateToken(UserDetails userDetails){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .addClaims(new HashMap<>()) // ✅ Khởi tạo claims trước
                .claim("sub", userDetails.getUsername())
                .claim("iat", now) // ✅ Issued At
                .claim("exp", expiryDate) // ✅ Expiration
                .signWith(Key)
                .compact();
    }
    public  String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails){
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .addClaims(claims) // ✅ Thay thế .claims(claims) bằng .addClaims(claims)
                .claim("sub", userDetails.getUsername())
                .claim("iat", now)
                .claim("exp", expiryDate)
                .signWith(Key)
                .compact();
    }

    public  String extractUsername(String token){
        return  extractClaims(token, Claims::getSubject);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction){
        return claimsTFunction.apply(Jwts.parserBuilder()
                .setSigningKey(Key) // ✅ Đúng cách dùng mới
                .build()
                .parseClaimsJws(token)
                .getBody());
    }

    public  boolean isTokenValid(String token, UserDetails userDetails){
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public  boolean isTokenExpired(String token){
        return extractClaims(token, Claims::getExpiration).before(new Date());
    }


}