package school.sptech.tripping.app.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class Viagem {
    private Long id;
    private Long userId;
    private String destino;
    private LocalDate dataSaida;
    private LocalDate dataRetorno;
    private String moeda;
    private String status;
    private String notas;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataUltimaAtualizacao;

    public Viagem(Long id, Long userId, String destino, LocalDate dataSaida, LocalDate dataRetorno, String moeda, String status, String notas, LocalDateTime dataCriacao, LocalDateTime dataUltimaAtualizacao) {
        this.id = id;
        this.userId = userId;
        this.destino = destino;
        this.dataSaida = dataSaida;
        this.dataRetorno = dataRetorno;
        this.moeda = moeda;
        this.status = status;
        this.notas = notas;
        this.dataCriacao = dataCriacao;
        this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    }

    public Viagem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @JsonProperty("destination")
    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    @JsonProperty("departureDate")
    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }

    @JsonProperty("returnDate")
    public LocalDate getDataRetorno() {
        return dataRetorno;
    }

    public void setDataRetorno(LocalDate dataRetorno) {
        this.dataRetorno = dataRetorno;
    }

    @JsonProperty("currency")
    public String getMoeda() {
        return moeda;
    }

    public void setMoeda(String moeda) {
        this.moeda = moeda;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @JsonProperty("notes")
    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    @JsonProperty("createdAt")
    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    @JsonProperty("updatedAt")
    public LocalDateTime getDataUltimaAtualizacao() {
        return dataUltimaAtualizacao;
    }

    public void setDataUltimaAtualizacao(LocalDateTime dataUltimaAtualizacao) {
        this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    }
}
