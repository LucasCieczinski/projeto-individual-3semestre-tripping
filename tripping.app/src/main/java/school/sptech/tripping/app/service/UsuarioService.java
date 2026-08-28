package school.sptech.tripping.app.service;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import school.sptech.tripping.app.dto.CriarUsuarioRequest;
import school.sptech.tripping.app.dto.LoginUsuarioRequest;
import school.sptech.tripping.app.exception.ConflitoException;
import school.sptech.tripping.app.exception.RequisicaoInvalidaException;
import school.sptech.tripping.app.model.Usuario;
import school.sptech.tripping.app.repository.UsuarioRepository;

import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class UsuarioService {

    private static final Pattern PADRAO_EMAIL =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Usuario> identificar(LoginUsuarioRequest requisicao) {
        if (requisicao == null) {
            throw new RequisicaoInvalidaException("O e-mail é obrigatório.");
        }

        String email = normalizarEmail(requisicao.email());
        return usuarioRepository.buscarPorEmail(email);
    }

    public Usuario criar(CriarUsuarioRequest requisicao) {
        if (requisicao == null) {
            throw new RequisicaoInvalidaException("Informe o nome e o e-mail.");
        }

        String nome = validarNome(requisicao.nome());
        String email = normalizarEmail(requisicao.email());

        if (usuarioRepository.buscarPorEmail(email).isPresent()) {
            throw new ConflitoException("Já existe um usuário cadastrado com esse e-mail.");
        }

        try {
            return usuarioRepository.salvar(nome, email);
        } catch (DataIntegrityViolationException excecao) {
            throw new ConflitoException("Já existe um usuário cadastrado com esse e-mail.");
        }
    }

    private String validarNome(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new RequisicaoInvalidaException("O nome é obrigatório.");
        }

        String nome = valor.trim();
        if (nome.length() > 100) {
            throw new RequisicaoInvalidaException("O nome deve ter no máximo 100 caracteres.");
        }

        return nome;
    }

    private String normalizarEmail(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new RequisicaoInvalidaException("O e-mail é obrigatório.");
        }

        String email = valor.trim().toLowerCase(Locale.ROOT);
        if (email.length() > 254 || !PADRAO_EMAIL.matcher(email).matches()) {
            throw new RequisicaoInvalidaException("Informe um e-mail válido.");
        }

        return email;
    }
}
