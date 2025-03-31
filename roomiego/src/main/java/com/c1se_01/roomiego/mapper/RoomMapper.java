package com.c1se_01.roomiego.mapper;

import com.c1se_01.roomiego.dto.RoomDTO;
import com.c1se_01.roomiego.model.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(source = "owner.id", target = "ownerId")
    RoomDTO toDTO(Room room);

    @Mapping(source = "ownerId", target = "owner.id")
    Room toEntity(RoomDTO roomDTO);

    List<RoomDTO> toDTOList(List<Room> rooms);

    default void updateEntityFromDTO(RoomDTO dto, Room entity) {
        Optional.ofNullable(dto.getTitle()).ifPresent(entity::setTitle);
        Optional.ofNullable(dto.getDescription()).ifPresent(entity::setDescription);
        Optional.ofNullable(dto.getPrice()).ifPresent(entity::setPrice);
        Optional.ofNullable(dto.getLocation()).ifPresent(entity::setLocation);
        Optional.ofNullable(dto.getLatitude()).ifPresent(entity::setLatitude);
        Optional.ofNullable(dto.getLongitude()).ifPresent(entity::setLongitude);
        Optional.ofNullable(dto.getRoomSize()).ifPresent(entity::setRoomSize);
        Optional.ofNullable(dto.getNumBedrooms()).ifPresent(entity::setNumBedrooms);
        Optional.ofNullable(dto.getNumBathrooms()).ifPresent(entity::setNumBathrooms);
        Optional.ofNullable(dto.getAvailableFrom()).ifPresent(entity::setAvailableFrom);
        Optional.ofNullable(dto.getIsRoomAvailable()).ifPresent(entity::setIsRoomAvailable);
        Optional.ofNullable(dto.getCity()).ifPresent(entity::setCity);
        Optional.ofNullable(dto.getDistrict()).ifPresent(entity::setDistrict);
        Optional.ofNullable(dto.getWard()).ifPresent(entity::setWard);
        Optional.ofNullable(dto.getStreet()).ifPresent(entity::setStreet);
        Optional.ofNullable(dto.getAddressDetails()).ifPresent(entity::setAddressDetails);
    }
}
