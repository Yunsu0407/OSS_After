package zxcv.asdf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import zxcv.asdf.domain.*;
import zxcv.asdf.DTO.page6_chat;
import zxcv.asdf.repository.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChattingService {

    private final ChattingRepository chattingRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final AnswerRepository answerRepository;
    private final LectureRepository lectureRepository;
    private final LectureAssignmentRepository lectureAssignmentRepository;



    public List<page6_chat> getAllChats() {
        return chattingRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public Optional<page6_chat> getChatById(Long id) {
        return chattingRepository.findById(id).map(this::convertToDTO);
    }

    public List<page6_chat> getChatsBySenderToken(String senderToken) {
        return chattingRepository.findBySender_Token(senderToken).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public List<page6_chat> getChatsByTeamAndAnswer(Long teamId, Long answerId) {
        return chattingRepository.findByTeam_IdAndAnswer_Id(teamId, answerId).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public page6_chat saveChat(page6_chat chatDto) {
        User sender = userRepository.findById(chatDto.getSenderToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid sender token"));
        Lecture lecture = lectureRepository.findById(chatDto.getLectureId())
                .orElseThrow(() -> new IllegalArgumentException("123"));
        LectureAssignment assignment = lectureAssignmentRepository.findById(chatDto.getLectureassignmentId())
                .orElseThrow(() -> new IllegalArgumentException("해당하는 과제없음"));
        Team team = teamRepository.findByUserTokenAndLectureId(sender.getToken(), lecture.getId());
        Answer answer = answerRepository.findByUserTokenAndAssignmentId(sender.getToken(), assignment.getId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid answer ID"));
        Chatting chatting = Chatting.builder()
                .sender(sender)
                .senderName(sender.getName())
                .team(team)
                .answer(answer)
                .content(chatDto.getContent())
                .timestamp(chatDto.getTimestamp())
                .build();

        Chatting savedChat = chattingRepository.save(chatting);
        return convertToDTO(savedChat);
    }

    public void deleteChat(Long id) {
        chattingRepository.deleteById(id);
    }

    private page6_chat convertToDTO(Chatting chatting) {
        return page6_chat.builder()
                .senderToken(chatting.getSender().getToken())
                .senderName(chatting.getSenderName())
                .lectureId(chatting.getTeam().getLecture().getId())
                .lectureassignmentId(chatting.getAnswer().getAssignment().getId())
                .content(chatting.getContent())
                .timestamp(chatting.getTimestamp())
                .build();
    }
}
