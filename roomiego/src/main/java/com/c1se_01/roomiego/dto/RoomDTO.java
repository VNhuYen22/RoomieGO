package com.c1se_01.roomiego.dto;

import com.c1se_01.roomiego.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String location;
    private Double latitude;
    private Double longitude;
    private Float roomSize;
    private Integer numBedrooms;
    private Integer numBathrooms;
    private Date availableFrom;
    private Status status;
    private Long ownerId;
}
