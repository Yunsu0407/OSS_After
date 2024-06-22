package zxcv.asdf.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zxcv.asdf.DTO.AssignmentDTO;
import zxcv.asdf.DTO.LectureDTO;
import zxcv.asdf.DTO.UserDTO;
import zxcv.asdf.DTO.page2_lecture;
import zxcv.asdf.domain.*;
import zxcv.asdf.repository.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final TeamRepository teamRepository;
    private final LectureAssignmentMappingRepository lectureAssignmentMappingRepository;
    private final LectureAssignmentRepository lectureAssignmentRepository;
    private final LectureRepository lectureRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AnswerRepository answerRepository;

    private AssignmentDTO convertToDTO(LectureAssignment assignment, String token) {
        // Answer 엔티티를 가져옵니다.
        Optional<Answer> answerOpt = answerRepository.findByUserAndAssignment(userRepository.findByToken(token).orElseThrow(()
                -> new RuntimeException("User not found")), assignment);

        Boolean correct = answerOpt.map(Answer::getCorrect).orElse(null);

        return AssignmentDTO.builder()
                .title(assignment.getTitle())
                .assignmentId(assignment.getId())
                .description(assignment.getDescription())
                .deadline(assignment.getDeadline())
                .problem(assignment.getProblem())
                .correct(correct) // correct 필드를 설정합니다.
                .build();
    }

    @Transactional
    public User addUser(User user) {
        Optional<User> existingUser = userRepository.findById(user.getToken());
        return existingUser.orElseGet(() -> userRepository.save(user));
    }

    public User getUser(String token) {
        System.out.println(token);
        return userRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Lecture addLecture(Lecture lecture) {
        User user = userRepository.findByToken(lecture.getMadeby())
                .orElseThrow(() -> new RuntimeException("User not found"));
        lecture.setMadeby_name(user.getName());
        return lectureRepository.save(lecture);
    }

    public Lecture getLectureById(Long id) {
        return lectureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lecture not found"));
    }

    public Lecture getLectureByName(String name) {
        return lectureRepository.findByName(name);
    }

    public List<LocalDateTime> getDeadlines(String token) {
        User user = userRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 사용자가 등록한 모든 강의 ID를 가져옵니다.
        List<Long> lectureIds = enrollmentRepository.findLectureIdsByUserId(user.getToken());

        // 해당 강의들에 대한 모든 과제의 마감 시간을 가져옵니다.
        List<LocalDateTime> deadlines = lectureAssignmentRepository.findDeadlinesByLectureIds(lectureIds);

        return deadlines;
    }

    public LectureAssignment getLectureAssignmentByLectureId(Long lectureId) {
        return lectureAssignmentRepository.findByLectureId(lectureId)
                .orElseThrow(() -> new RuntimeException("Lecture Assignment not found"));
    }

    public page2_lecture getPage2Lecture(String token, Long lectureId) {
        Long teamId = teamRepository.findTeamIdByLectureIdAndToken(lectureId, token);

        List<String> teamMemberTokens = teamRepository.findUserTokensByLectureIdAndTeamId(lectureId, teamId);
        List<User> teamMembers = userRepository.findAllByTokenIn(teamMemberTokens);

        // Convert teamMembers to UserDTO
        List<UserDTO> teamMemberDTOs = teamMembers.stream()
                .map(user -> UserDTO.builder()
                        .token(user.getToken())
                        .name(user.getName())
                        .build())
                .collect(Collectors.toList());

        // Get lecture assignments
        List<LectureAssignmentMapping> allMappings = lectureAssignmentMappingRepository.findByLectureId(lectureId);

        List<Long> userAssignmentIds = allMappings.stream()
                .filter(mapping -> mapping.getUser().getToken().equals(token))
                .map(LectureAssignmentMapping::getLectureAssignmentId)
                .collect(Collectors.toList());

        List<Long> otherAssignmentIds = allMappings.stream()
                .filter(mapping -> !mapping.getUser().getToken().equals(token))
                .map(LectureAssignmentMapping::getLectureAssignmentId)
                .collect(Collectors.toList());

        List<LectureAssignment> userAssignments = lectureAssignmentRepository.findAllById(userAssignmentIds);
        List<LectureAssignment> otherAssignments = lectureAssignmentRepository.findAllById(otherAssignmentIds);

        // Convert assignments to DTOs with correct values
        List<AssignmentDTO> userAssignmentDTOs = userAssignments.stream()
                .map(assignment -> convertToDTO(assignment, token))
                .collect(Collectors.toList());

        List<AssignmentDTO> otherAssignmentDTOs = otherAssignments.stream()
                .map(assignment -> convertToDTO(assignment, token))
                .collect(Collectors.toList());

        return page2_lecture.builder()
                .task(userAssignmentDTOs)
                .exercise(otherAssignmentDTOs)
                .teamMembers(teamMemberDTOs)
                .build();
    }


    @Transactional
    public Enrollment addOrUpdateEnrollment(Enrollment enrollment) {
        User user = enrollment.getUser();
        Lecture lecture = enrollment.getLecture();

        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserAndLecture(user, lecture);

        if (existingEnrollment.isPresent()) {
            Enrollment existing = existingEnrollment.get();
            // 필요한 필드를 업데이트합니다.
            // 예: existing.setSomeField(enrollment.getSomeField());
            return enrollmentRepository.save(existing);
        } else {
            return enrollmentRepository.save(enrollment);
        }
    }


    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }


    public List<Lecture> getLecturesByUserToken(String token, String name) {
        return lectureRepository.findLecturesByUserToken(token, name);
    }

    public LectureAssignment addLectureAssignment(String token,LectureAssignment lectureAssignment) {
        lectureAssignmentRepository.save(lectureAssignment);
        LectureAssignmentMapping lectureAssignmentMapping= LectureAssignmentMapping.builder()
                .user(userRepository.findByToken(token).orElseThrow(() -> new RuntimeException("User not found")))
                .lecture(lectureAssignment.getLecture())
                .lectureAssignment(lectureAssignment)
                .build();
        lectureAssignmentMappingRepository.save(lectureAssignmentMapping);
        return lectureAssignment;
    }
    public LectureAssignment getLectureAssignmentById(Long lectureAssignmentId) {
        return lectureAssignmentRepository.findById(lectureAssignmentId)
                .orElseThrow(() -> new RuntimeException("Lecture Assignment not found"));
    }

}


