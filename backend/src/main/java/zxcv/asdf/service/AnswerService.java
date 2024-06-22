package zxcv.asdf.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zxcv.asdf.domain.Answer;
import zxcv.asdf.domain.LectureAssignment;
import zxcv.asdf.domain.User;
import zxcv.asdf.repository.AnswerRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepository;

    @Transactional
    public Answer saveOrUpdateAnswer(Answer answer) {
        User user = answer.getUser();
        LectureAssignment assignment = answer.getAssignment();

        Optional<Answer> existingAnswerOpt = answerRepository.findByUserAndAssignment(user, assignment);

        if (existingAnswerOpt.isPresent()) {
            Answer existingAnswer = existingAnswerOpt.get();
            // 필요한 필드를 업데이트합니다.
            existingAnswer.setCorrect(answer.getCorrect());
            existingAnswer.setAnswerText(answer.getAnswerText());
            // 기존 엔티티를 저장하여 업데이트합니다.
            return answerRepository.save(existingAnswer);
        } else {
            // 새로운 엔티티를 저장합니다.
            return answerRepository.save(answer);
        }
    }

    @Transactional
    public Optional<Answer> findAnswerByUserTokenAndAssignmentId(String userToken, Long assignmentId) {
        return answerRepository.findByUserTokenAndAssignmentId(userToken, assignmentId);
    }
}
