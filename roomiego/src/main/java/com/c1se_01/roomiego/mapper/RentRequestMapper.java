package com.c1se_01.roomiego.mapper;

import com.c1se_01.roomiego.dto.RentRequestResponse;
import com.c1se_01.roomiego.model.RentRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface RentRequestMapper {
    RentRequestMapper INSTANCE = Mappers.getMapper(RentRequestMapper.class);

    @Mapping(source = "tenant.id", target = "tenantId")
    @Mapping(source = "room.id", target = "roomId")
    RentRequestResponse toDto(RentRequest rentRequest);
}