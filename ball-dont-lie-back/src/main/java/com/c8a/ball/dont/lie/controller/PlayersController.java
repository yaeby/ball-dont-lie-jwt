package com.c8a.ball.dont.lie.controller;

import com.c8a.ball.dont.lie.PlayersRepository;
import com.c8a.ball.dont.lie.model.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
public class PlayersController {

    private final PlayersRepository playersRepository;

    @GetMapping
    public String getPlayers() {
        return "Players";
    }

    @GetMapping("/{playerId}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long playerId) {
        Optional<Player> playerOptional = playersRepository.findById(playerId);
        return playerOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createPlayer(@RequestBody Player player) {
        playersRepository.save(player);
        return ResponseEntity.ok("Player created successfully");
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<String> deletePlayer(@PathVariable Long playerId) {
        playersRepository.deleteById(playerId);
        return ResponseEntity.ok("Player deleted successfully");
    }
}
