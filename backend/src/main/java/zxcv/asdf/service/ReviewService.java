package zxcv.asdf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zxcv.asdf.DTO.*;
import zxcv.asdf.domain.*;
import zxcv.asdf.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ChattingService chattingService;
    private final AnswerRepository answerRepository;
    private final TeamRepository teamRepository;
    private final ChattingRepository chattingRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final LectureAssignmentRepository lectureAssignmentRepository;
    private final LectureAssignmentMappingRepository lectureAssignmentMappingRepository;
    private final LectureRepository lectureRepository;
    private final UserService userService;

    public static Map<String, String> chats = new LinkedHashMap<>();

    static {
        chats.put("한윤수", "버블 정렬로 풀었어요 ~");
        chats.put("김민선", "다음엔 퀵 정렬로 해보세요. 퀵 정렬은 더 빨라요.");
        chats.put("최진석", "근데 퀵 정렬은 구현이 좀 어려워요!");
    }

    public page6_chat convertToPage6Chat(Chatting chatting) {
        return page6_chat.builder()
                .senderToken(chatting.getSender().getToken())
                .senderName(chatting.getSenderName())
                .lectureId(chatting.getTeam().getLecture().getId())
                .lectureassignmentId(chatting.getAnswer().getAssignment().getId())
                .content(chatting.getContent())
                .timestamp(chatting.getTimestamp())
                .build();
    }
    private AssignmentDTO convertToDTO(LectureAssignment assignment, String token) {
        Optional<Answer> answerOpt = answerRepository.findByUserAndAssignment(userRepository.findByToken(token).orElseThrow(()
                -> new RuntimeException("User not found")), assignment);

        Boolean correct = answerOpt.map(Answer::getCorrect).orElse(null);

        return AssignmentDTO.builder()
                .title(assignment.getTitle())
                .assignmentId(assignment.getId())
                .description(assignment.getDescription())
                .deadline(assignment.getDeadline())
                .problem(assignment.getProblem())
                .correct(correct)
                .build();
    }

    /*public page6 getPage6(String token,Long lectureassignmentId) {

        User user = userService.getUser(token);

        Lecture lecture = lectureRepository
                .getById(lectureAssignmentMappingRepository.findLectureIdByLectureAssignmentId(lectureassignmentId));

        LectureAssignment assignment = lectureAssignmentRepository.findById(lectureassignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid lecture assignment ID"));

        Team t = teamRepository.findByUserTokenAndLectureId(token, lecture.getId());

        Answer answer = answerRepository.findByUserTokenAndAssignmentId(token, lectureassignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user token"));

        List<page6_chat> allChats = new ArrayList<>();

        //List<Chatting> chats = chattingRepository.findByTeam_IdAndAnswer_Id(t.getTeam_id(), answer.getId());


        *//*List<page6_chat> page6Chats = chats.stream()
                .map(this::convertToPage6Chat)
                .collect(Collectors.toList());*//*
        //allChats.addAll(page6Chats);




        page6 p = page6.builder()
                .description(assignment.getDescription())
                .hw_test1(assignment.getHwTest1())
                .hw_test_answer1(assignment.getHwTestAnswer1())
                .answer_text(answer.getAnswerText())
                .assignment_id(assignment.getId())
                .user_token(user.getToken())
                .chats(allChats)
                .gpt_feedback(answer.getGptFeedback())
                .correct(answer.getCorrect())
                .build();

        return p;
    }*/
    public page666 getPage666(String token,Long lectureassignmentId) {

        User user = userService.getUser(token);

        Lecture lecture = lectureRepository
                .getById(lectureAssignmentMappingRepository.findLectureIdByLectureAssignmentId(lectureassignmentId));

        LectureAssignment assignment = lectureAssignmentRepository.findById(lectureassignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid lecture assignment ID"));

        Team t = teamRepository.findByUserTokenAndLectureId(token, lecture.getId());

        Answer answer = answerRepository.findByUserTokenAndAssignmentId(token, lectureassignmentId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user token"));

        //List<Chatting> chats = chattingRepository.findByTeam_IdAndAnswer_Id(t.getTeam_id(), answer.getId());



        page666 p = page666.builder()
                .description(assignment.getDescription())
                .hw_test1(assignment.getHwTest1())
                .hw_test_answer1(assignment.getHwTestAnswer1())
                .answer_text(answer.getAnswerText())
                .assignment_id(assignment.getId())
                .user_token(user.getToken())
                .chats(new LinkedHashMap<>(chats))
                .gpt_feedback(answer.getGptFeedback())
                .correct(answer.getCorrect())
                .build();

        chats.remove("김지우");

        return p;
    }
    public void savechat(Chat chat) {
        User user = userRepository.findByToken(chat.getToken()).orElseThrow(() -> new RuntimeException("User not found"));
        chats.put(user.getName(),chat.getText());
    }

    public page7 getReviewList(String token, String membertoken, Long lectureId) {
        // Answer 데이터베이스에서 membertoken에 해당하는 답변을 조회
        List<Answer> memberAnswers = answerRepository.findByUserToken(membertoken);

        // Answer에서 과제 ID 목록 추출 및 lectureId로 필터링
        List<Long> memberAssignmentIds = memberAnswers.stream()
                .filter(answer -> answer.getAssignment().getLecture().getId().equals(lectureId))
                .map(answer -> answer.getAssignment().getId())
                .collect(Collectors.toList());

        // Answer 데이터베이스에서 usertoken에 해당하는 답변을 조회
        List<Answer> userAnswers = answerRepository.findByUserToken(token);

        // Answer에서 과제 ID 목록 추출 및 lectureId로 필터링
        List<Long> userAssignmentIds = userAnswers.stream()
                .filter(answer -> answer.getAssignment().getLecture().getId().equals(lectureId))
                .map(answer -> answer.getAssignment().getId())
                .collect(Collectors.toList());

        // membertoken이 제출한 과제 중 usertoken이 아직 제출하지 않은 과제를 필터링
        List<Long> filteredAssignmentIds = memberAssignmentIds.stream()
                .filter(memberAssignmentId -> userAssignmentIds.contains(memberAssignmentId))
                .collect(Collectors.toList());

        // 과제 ID 목록으로 LectureAssignment 조회 및 problem = 1로 필터링
        List<LectureAssignment> filteredAssignments = lectureAssignmentRepository.findByIdIn(filteredAssignmentIds).stream()
                .filter(assignment -> "1".equals(assignment.getProblem()))
                .collect(Collectors.toList());

        // DTO로 변환
        List<AssignmentDTO> assignmentDTOs = filteredAssignments.stream()
                .map(assignment -> convertToDTO(assignment, membertoken))
                .collect(Collectors.toList());

        return page7.builder()
                .list(assignmentDTOs)
                .build();
    }


}

