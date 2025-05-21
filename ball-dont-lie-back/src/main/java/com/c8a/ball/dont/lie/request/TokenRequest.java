package com.c8a.ball.dont.lie.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class TokenRequest {
    private List<String> permissions;
    private String role;
}
