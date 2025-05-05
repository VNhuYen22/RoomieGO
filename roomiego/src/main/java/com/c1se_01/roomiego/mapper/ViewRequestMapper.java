package com.c1se_01.roomiego.mapper;

import com.c1se_01.roomiego.dto.ViewRequestCreateDTO;
import com.c1se_01.roomiego.dto.ViewRequestDTO;
import com.c1se_01.roomiego.model.ViewRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ViewRequestMapper {
    @Mapping(source = "room.id", target = "roomId")
    @Mapping(source = "renter.id", target = "renterId")
    ViewRequestDTO toDTO(ViewRequest viewRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "room", ignore = true)
    @Mapping(target = "renter", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "adminNote", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ViewRequest toEntity(ViewRequestCreateDTO dto);
}
