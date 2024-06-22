package zxcv.asdf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zxcv.asdf.domain.Answer;

@Repository
public interface ReviewRepository extends JpaRepository<Answer, Long> {
}
