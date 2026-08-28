package school.sptech.tripping.app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record ViagemRequest(
        @JsonProperty("destination") String destino,
        @JsonProperty("departureDate") LocalDate dataSaida,
        @JsonProperty("returnDate") LocalDate dataRetorno,
        @JsonProperty("currency") String moeda,
        String status,
        @JsonProperty("notes") String notas
) {}
