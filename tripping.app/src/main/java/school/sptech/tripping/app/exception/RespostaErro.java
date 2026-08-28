package school.sptech.tripping.app.exception;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

public record RespostaErro(
        int status,
        @JsonProperty("message") String mensagem,
        String caminho,
        OffsetDateTime dataHora
) {
}
