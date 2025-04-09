package com.c1se_01.roomiego.dto;

import lombok.Data;

@Data
public class RoommateDTO {
    private String gender;
    private Integer yob;
    private String hometown;
    private String job;
    private String hobbies;
    private String more;
    private Long userId; // để ánh xạ với entity User
}
