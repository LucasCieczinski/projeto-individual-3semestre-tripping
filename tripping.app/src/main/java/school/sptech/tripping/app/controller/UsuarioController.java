package school.sptech.tripping.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import school.sptech.tripping.app.dto.CriarUsuarioRequest;
import school.sptech.tripping.app.dto.LoginUsuarioRequest;
import school.sptech.tripping.app.model.Usuario;
import school.sptech.tripping.app.service.UsuarioService;

import java.net.URI;

@RestController
@RequestMapping("/api/users")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/identify")
    public ResponseEntity<Usuario> identificar(@RequestBody LoginUsuarioRequest requisicao) {
        return usuarioService.identificar(requisicao)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody CriarUsuarioRequest requisicao) {
        Usuario usuarioCriado = usuarioService.criar(requisicao);
        URI localizacao = URI.create("/api/users/" + usuarioCriado.getId());

        return ResponseEntity.created(localizacao).body(usuarioCriado);
    }
}
