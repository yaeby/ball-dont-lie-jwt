package com.c8a.ball.dont.lie.controller;

import com.c8a.ball.dont.lie.PlayersRepository;
import com.c8a.ball.dont.lie.model.Player;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/prospects")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProspectController {

    private final PlayersRepository playersRepository;

    @GetMapping
    public ResponseEntity<List<Player>> getAllPlayers() {
        return ResponseEntity.ok(playersRepository.findAll());
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

    @PutMapping("/{playerId}")
    public ResponseEntity<String> updatePlayer(@PathVariable Long playerId, @RequestBody Player player) {
        Optional<Player> playerOptional = playersRepository.findById(playerId);

        if (playerOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Player existingPlayer = playerOptional.get();

        existingPlayer.setFirstName(player.getFirstName());
        existingPlayer.setLastName(player.getLastName());
        existingPlayer.setPosition(player.getPosition());
        existingPlayer.setHeight(player.getHeight());
        existingPlayer.setWeight(player.getWeight());
        existingPlayer.setJerseyNumber(player.getJerseyNumber());
        existingPlayer.setCollege(player.getCollege());
        existingPlayer.setCountry(player.getCountry());

        playersRepository.save(existingPlayer);
        return ResponseEntity.ok("Player updated successfully");
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<String> deletePlayer(@PathVariable Long playerId) {
        playersRepository.deleteById(playerId);
        return ResponseEntity.ok("Player deleted successfully");
    }
}
