package com.c8a.ball.dont.lie.controller;

import com.c8a.ball.dont.lie.model.Player;
import com.c8a.ball.dont.lie.repository.PlayersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/prospects")
@RequiredArgsConstructor
public class ProspectController {

    private final PlayersRepository playersRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPlayers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        try {
            Sort sort = direction.equalsIgnoreCase("asc") ?
                    Sort.by(sortBy).ascending() :
                    Sort.by(sortBy).descending();

            Pageable pageable = PageRequest.of(page, size, sort);

            Page<Player> pageResult = playersRepository.findAll(pageable);
            List<Player> players = pageResult.getContent();

            Map<String, Object> response = new HashMap<>();
            response.put("players", players);
            response.put("currentPage", pageResult.getNumber());
            response.put("totalItems", pageResult.getTotalElements());
            response.put("totalPages", pageResult.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{playerId}")
    public ResponseEntity<Player> getPlayerById(@PathVariable Long playerId) {
        Optional<Player> playerOptional = playersRepository.findById(playerId);
        return playerOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPlayer(@RequestBody Player player) {
        try {
            Player savedPlayer = playersRepository.save(player);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Player created successfully");
            response.put("player", savedPlayer);
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Failed to create player: " + e.getMessage());
            response.put("status", "error");

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{playerId}")
    public ResponseEntity<Map<String, Object>> updatePlayer(@PathVariable Long playerId, @RequestBody Player player) {
        Optional<Player> playerOptional = playersRepository.findById(playerId);
        Map<String, Object> response = new HashMap<>();

        if (playerOptional.isEmpty()) {
            response.put("message", "Player not found with id: " + playerId);
            response.put("status", "error");
            return ResponseEntity.notFound().build();
        }

        try {
            Player existingPlayer = playerOptional.get();

            existingPlayer.setFirstName(player.getFirstName());
            existingPlayer.setLastName(player.getLastName());
            existingPlayer.setPosition(player.getPosition());
            existingPlayer.setHeight(player.getHeight());
            existingPlayer.setWeight(player.getWeight());
            existingPlayer.setJerseyNumber(player.getJerseyNumber());
            existingPlayer.setCollege(player.getCollege());
            existingPlayer.setCountry(player.getCountry());

            Player updatedPlayer = playersRepository.save(existingPlayer);

            response.put("message", "Player updated successfully");
            response.put("player", updatedPlayer);
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to update player: " + e.getMessage());
            response.put("status", "error");

            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Map<String, Object>> deletePlayer(@PathVariable Long playerId) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (!playersRepository.existsById(playerId)) {
                response.put("message", "Player not found with id: " + playerId);
                response.put("status", "error");
                return ResponseEntity.notFound().build();
            }

            playersRepository.deleteById(playerId);

            response.put("message", "Player deleted successfully");
            response.put("status", "success");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Failed to delete player: " + e.getMessage());
            response.put("status", "error");

            return ResponseEntity.badRequest().body(response);
        }
    }
}