package school.sptech.tripping.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CriarUsuarioRequest(
        @JsonProperty("name") String nome,
        String email
) {}
