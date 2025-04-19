package com.c1se_01.roomiego.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class RoommateResponseDTO {
    private String gender;
    private Integer yob;
    private String hometown;
    private String job;
    private String hobbies;
    private String more;
    private Long userId;
}
