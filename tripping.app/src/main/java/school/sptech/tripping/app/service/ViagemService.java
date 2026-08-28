package school.sptech.tripping.app.service;

import org.springframework.stereotype.Service;
import school.sptech.tripping.app.dto.ViagemRequest;
import school.sptech.tripping.app.exception.RecursoNaoEncontradoException;
import school.sptech.tripping.app.exception.RequisicaoInvalidaException;
import school.sptech.tripping.app.model.Viagem;
import school.sptech.tripping.app.repository.UsuarioRepository;
import school.sptech.tripping.app.repository.ViagemRepository;

import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class ViagemService {

    private static final Set<String> STATUS_PERMITIDOS =
            Set.of("planning", "confirmed", "completed");

    private final ViagemRepository viagemRepository;
    private final UsuarioRepository usuarioRepository;

    public ViagemService(
            ViagemRepository viagemRepository,
            UsuarioRepository usuarioRepository) {
        this.viagemRepository = viagemRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Viagem> listarPorUsuario(Long usuarioId) {
        validarUsuario(usuarioId);
        return viagemRepository.listarPorUsuario(usuarioId);
    }

    public Viagem criar(Long usuarioId, ViagemRequest requisicao) {
        validarUsuario(usuarioId);
        Viagem viagem = validarEMontarViagem(requisicao);
        return viagemRepository.salvar(usuarioId, viagem);
    }

    public Viagem atualizar(Long viagemId, ViagemRequest requisicao) {
        validarIdentificador(viagemId, "O identificador da viagem é inválido.");
        Viagem viagem = validarEMontarViagem(requisicao);

        return viagemRepository.atualizar(viagemId, viagem)
                .orElseThrow(() ->
                        new RecursoNaoEncontradoException("Viagem não encontrada."));
    }

    public void excluir(Long viagemId) {
        validarIdentificador(viagemId, "O identificador da viagem é inválido.");

        if (!viagemRepository.excluir(viagemId)) {
            throw new RecursoNaoEncontradoException("Viagem não encontrada.");
        }
    }

    private Viagem validarEMontarViagem(ViagemRequest requisicao) {
        if (requisicao == null) {
            throw new RequisicaoInvalidaException("Informe os dados da viagem.");
        }

        String destino = validarDestino(requisicao.destino());

        if (requisicao.dataSaida() == null) {
            throw new RequisicaoInvalidaException("A data de ida é obrigatória.");
        }

        if (requisicao.dataRetorno() != null
                && requisicao.dataRetorno().isBefore(requisicao.dataSaida())) {
            throw new RequisicaoInvalidaException(
                    "A data de volta não pode ser anterior à data de ida.");
        }

        String moeda = validarMoeda(requisicao.moeda());
        String status = validarStatus(requisicao.status());
        String notas = validarNotas(requisicao.notas());

        return new Viagem(
                null,
                null,
                destino,
                requisicao.dataSaida(),
                requisicao.dataRetorno(),
                moeda,
                status,
                notas,
                null,
                null);
    }

    private String validarDestino(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new RequisicaoInvalidaException("O destino é obrigatório.");
        }

        String destino = valor.trim();
        if (destino.length() > 150) {
            throw new RequisicaoInvalidaException(
                    "O destino deve ter no máximo 150 caracteres.");
        }

        return destino;
    }

    private String validarMoeda(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new RequisicaoInvalidaException("A moeda é obrigatória.");
        }

        String moeda = valor.trim().toUpperCase(Locale.ROOT);
        if (!moeda.matches("^[A-Z]{3}$")) {
            throw new RequisicaoInvalidaException(
                    "A moeda deve ter três letras, como BRL ou EUR.");
        }

        return moeda;
    }

    private String validarStatus(String valor) {
        String status = valor == null || valor.isBlank()
                ? "planning"
                : valor.trim().toLowerCase(Locale.ROOT);

        if (!STATUS_PERMITIDOS.contains(status)) {
            throw new RequisicaoInvalidaException("O status da viagem é inválido.");
        }

        return status;
    }

    private String validarNotas(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        String notas = valor.trim();
        if (notas.length() > 1000) {
            throw new RequisicaoInvalidaException(
                    "As anotações devem ter no máximo 1000 caracteres.");
        }

        return notas;
    }

    private void validarUsuario(Long usuarioId) {
        validarIdentificador(usuarioId, "O identificador do usuário é inválido.");

        if (usuarioRepository.buscarPorId(usuarioId).isEmpty()) {
            throw new RecursoNaoEncontradoException("Usuário não encontrado.");
        }
    }

    private void validarIdentificador(Long id, String mensagem) {
        if (id == null || id <= 0) {
            throw new RequisicaoInvalidaException(mensagem);
        }
    }
}
