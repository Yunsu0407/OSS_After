package zxcv.asdf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import zxcv.asdf.domain.Chatting;

import java.util.List;

public interface ChattingRepository extends JpaRepository<Chatting, Long> {
    List<Chatting> findByTeam_IdAndAnswer_Id(Long teamId, Long answerId);
    List<Chatting> findBySender_Token(String senderToken);
}
