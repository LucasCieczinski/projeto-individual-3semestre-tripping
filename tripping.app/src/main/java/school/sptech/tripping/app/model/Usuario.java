package school.sptech.tripping.app.model;

import java.time.LocalDateTime;

public class Usuario {
    private Long id;
    private String nome;
    private String email;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataUltimaAtualizacao;

    public Usuario(Long id, String nome, String email, LocalDateTime dataCriacao, LocalDateTime dataUltimaAtualizacao) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.dataCriacao = dataCriacao;
        this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    }

    public Usuario() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return nome;
    }

    public void setName(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return dataCriacao;
    }

    public void setCreatedAt(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }

    public LocalDateTime getUpdatedAt() {
        return dataUltimaAtualizacao;
    }

    public void setUpdatedAt(LocalDateTime dataUltimaAtualizacao) {
        this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    }
}
