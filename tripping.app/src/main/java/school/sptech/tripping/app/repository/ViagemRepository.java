package school.sptech.tripping.app.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import school.sptech.tripping.app.model.Viagem;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public class ViagemRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Viagem> mapeadorViagem = (resultado, numeroLinha) -> {
        Timestamp dataCriacao = resultado.getTimestamp("created_at");
        Timestamp dataAtualizacao = resultado.getTimestamp("updated_at");

        return new Viagem(
                resultado.getLong("id"),
                resultado.getLong("user_id"),
                resultado.getString("destination"),
                resultado.getObject("departure_date", LocalDate.class),
                resultado.getObject("return_date", LocalDate.class),
                resultado.getString("currency").trim(),
                resultado.getString("status"),
                resultado.getString("notes"),
                dataCriacao.toLocalDateTime(),
                dataAtualizacao.toLocalDateTime()
        );
    };

    public ViagemRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Viagem> listarPorUsuario(Long usuarioId) {
        String sql = """
                SELECT id, user_id, destination, departure_date, return_date,
                       currency, status, notes, created_at, updated_at
                FROM trip
                WHERE user_id = ?
                ORDER BY departure_date
                """;

        return jdbcTemplate.query(sql, mapeadorViagem, usuarioId);
    }

    public Optional<Viagem> buscarPorId(Long id) {
        String sql = """
                SELECT id, user_id, destination, departure_date, return_date,
                       currency, status, notes, created_at, updated_at
                FROM trip
                WHERE id = ?
                """;

        return jdbcTemplate.query(sql, mapeadorViagem, id)
                .stream()
                .findFirst();
    }

    public Viagem salvar(Long usuarioId, Viagem viagem) {
        String sql = """
                INSERT INTO trip
                    (user_id, destination, departure_date, return_date, currency, status, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                RETURNING id, user_id, destination, departure_date, return_date,
                          currency, status, notes, created_at, updated_at
                """;

        return jdbcTemplate.queryForObject(
                sql,
                mapeadorViagem,
                usuarioId,
                viagem.getDestino(),
                viagem.getDataSaida(),
                viagem.getDataRetorno(),
                viagem.getMoeda(),
                viagem.getStatus(),
                viagem.getNotas());
    }

    public Optional<Viagem> atualizar(Long id, Viagem viagem) {
        String sql = """
                UPDATE trip
                SET destination = ?,
                    departure_date = ?,
                    return_date = ?,
                    currency = ?,
                    status = ?,
                    notes = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
                RETURNING id, user_id, destination, departure_date, return_date,
                          currency, status, notes, created_at, updated_at
                """;

        return jdbcTemplate.query(
                        sql,
                        mapeadorViagem,
                        viagem.getDestino(),
                        viagem.getDataSaida(),
                        viagem.getDataRetorno(),
                        viagem.getMoeda(),
                        viagem.getStatus(),
                        viagem.getNotas(),
                        id)
                .stream()
                .findFirst();
    }

    public boolean excluir(Long id) {
        return jdbcTemplate.update("DELETE FROM trip WHERE id = ?", id) > 0;
    }
}
