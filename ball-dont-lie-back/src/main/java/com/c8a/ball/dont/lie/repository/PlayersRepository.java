package com.c8a.ball.dont.lie.repository;

import com.c8a.ball.dont.lie.model.Player;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayersRepository extends JpaRepository<Player, Long> {
    Page<Player> findAll(Pageable pageable);
}
