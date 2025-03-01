package com.c1se_01.roomiego.repository;

import com.c1se_01.roomiego.model.Roommate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoommateRepository extends JpaRepository<Roommate, Long> {
}
