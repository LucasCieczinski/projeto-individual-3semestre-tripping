package school.sptech.tripping.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import school.sptech.tripping.app.dto.ViagemRequest;
import school.sptech.tripping.app.model.Viagem;
import school.sptech.tripping.app.service.ViagemService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ViagemController {

    private final ViagemService viagemService;

    public ViagemController(ViagemService viagemService) {
        this.viagemService = viagemService;
    }

    @GetMapping("/users/{usuarioId}/trips")
    public List<Viagem> listar(@PathVariable Long usuarioId) {
        return viagemService.listarPorUsuario(usuarioId);
    }

    @PostMapping("/users/{usuarioId}/trips")
    public ResponseEntity<Viagem> criar(
            @PathVariable Long usuarioId,
            @RequestBody ViagemRequest requisicao) {
        Viagem viagemCriada = viagemService.criar(usuarioId, requisicao);
        URI localizacao = URI.create("/api/trips/" + viagemCriada.getId());

        return ResponseEntity.created(localizacao).body(viagemCriada);
    }

    @PutMapping("/trips/{viagemId}")
    public Viagem atualizar(
            @PathVariable Long viagemId,
            @RequestBody ViagemRequest requisicao) {
        return viagemService.atualizar(viagemId, requisicao);
    }

    @DeleteMapping("/trips/{viagemId}")
    public ResponseEntity<Void> excluir(@PathVariable Long viagemId) {
        viagemService.excluir(viagemId);
        return ResponseEntity.noContent().build();
    }
}
