package com.c1se_01.roomiego.repository;

import com.c1se_01.roomiego.model.ViewRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ViewRequestRepository extends JpaRepository<ViewRequest, Long> {
}
