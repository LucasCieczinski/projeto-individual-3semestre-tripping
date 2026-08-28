package school.sptech.tripping.app.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import school.sptech.tripping.app.model.Usuario;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Usuario> mapeadorUsuario = (resultado, numeroLinha) -> {
        Timestamp dataCriacao = resultado.getTimestamp("created_at");
        Timestamp dataAtualizacao = resultado.getTimestamp("updated_at");

        return new Usuario(
                resultado.getLong("id"),
                resultado.getString("name"),
                resultado.getString("email"),
                dataCriacao.toLocalDateTime(),
                dataAtualizacao.toLocalDateTime()
        );
    };

    public UsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        String sql = """
                SELECT id, name, email, created_at, updated_at
                FROM app_user
                WHERE LOWER(email) = LOWER(?)
                """;

        return jdbcTemplate.query(sql, mapeadorUsuario, email)
                .stream()
                .findFirst();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        String sql = """
                SELECT id, name, email, created_at, updated_at
                FROM app_user
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, mapeadorUsuario, id)
                .stream()
                .findFirst();
    }

    public Usuario salvar(String nome, String email) {
        String sql = """
                INSERT INTO app_user (name, email)
                VALUES (?, ?)
                RETURNING id, name, email, created_at, updated_at
                """;

        return jdbcTemplate.queryForObject(sql, mapeadorUsuario, nome, email);
    }
}
