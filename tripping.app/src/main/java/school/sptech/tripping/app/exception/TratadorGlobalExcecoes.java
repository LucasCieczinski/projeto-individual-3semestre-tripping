package school.sptech.tripping.app.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;

@RestControllerAdvice
public class TratadorGlobalExcecoes {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<RespostaErro> tratarRecursoNaoEncontrado(
            RecursoNaoEncontradoException excecao,
            HttpServletRequest requisicao) {
        return criarResposta(HttpStatus.NOT_FOUND, excecao.getMessage(), requisicao);
    }

    @ExceptionHandler(ConflitoException.class)
    public ResponseEntity<RespostaErro> tratarConflito(
            ConflitoException excecao,
            HttpServletRequest requisicao) {
        return criarResposta(HttpStatus.CONFLICT, excecao.getMessage(), requisicao);
    }

    @ExceptionHandler(RequisicaoInvalidaException.class)
    public ResponseEntity<RespostaErro> tratarRequisicaoInvalida(
            RequisicaoInvalidaException excecao,
            HttpServletRequest requisicao) {
        return criarResposta(HttpStatus.BAD_REQUEST, excecao.getMessage(), requisicao);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<RespostaErro> tratarCorpoInvalido(
            HttpMessageNotReadableException excecao,
            HttpServletRequest requisicao) {
        return criarResposta(
                HttpStatus.BAD_REQUEST,
                "O corpo da requisição está inválido.",
                requisicao);
    }

    private ResponseEntity<RespostaErro> criarResposta(
            HttpStatus status,
            String mensagem,
            HttpServletRequest requisicao) {
        RespostaErro resposta = new RespostaErro(
                status.value(),
                mensagem,
                requisicao.getRequestURI(),
                OffsetDateTime.now());

        return ResponseEntity.status(status).body(resposta);
    }
}
