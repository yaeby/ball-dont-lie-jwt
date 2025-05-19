package com.c8a.ball.dont.lie.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/players")
public class PlayersController {

    @GetMapping
    public String getPlayers() {
        return "Players";
    }
}
