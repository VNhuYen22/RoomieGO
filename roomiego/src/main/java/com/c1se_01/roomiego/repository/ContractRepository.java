package com.c1se_01.roomiego.repository;

import com.c1se_01.roomiego.model.Contract;
import com.c1se_01.roomiego.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
        @Query("SELECT c FROM Contract c WHERE c.room = :room AND " +
                        "((c.startDate <= :endDate AND c.endDate >= :startDate))")
        List<Contract> findByRoomAndDateRange(
                        @Param("room") Room room,
                        @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);
}
