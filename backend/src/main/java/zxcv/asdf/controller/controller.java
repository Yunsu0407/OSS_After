package zxcv.asdf.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import zxcv.asdf.DTO.*;
import zxcv.asdf.domain.*;
import zxcv.asdf.repository.LectureAssignmentRepository;
import zxcv.asdf.repository.UserRepository;
import zxcv.asdf.service.*;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
public class controller {


    @Value("${api.key}")
    private String CLIENT_ID; // REST API 키
    @Value("${redirect.uri}")
    private String REDIRECT_URI;// 리디렉션 URI
    @Value("${token.request.uri}")
    private String TOKEN_REQUEST_URI;

    private final CheckingService checkingService;
    private final UserService userService;
    private final CodeFeedbackService codeFeedbackService;
    private final RandomTeamService randomTeamService;
    private final LectureAssignmentService lectureAssignmentService;
    private final AnswerService answerService;
    private final UserRepository userRepository;
    private final LectureAssignmentRepository lectureAssignmentRepository;

    @GetMapping("/login")
    public void login(@RequestParam String code, HttpServletResponse response) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", CLIENT_ID);
        params.add("redirect_uri", REDIRECT_URI);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<String> tokenResponse = restTemplate.postForEntity(TOKEN_REQUEST_URI, request, String.class);
        String token;
        String name;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = rootNode.path("access_token").asText();

            // 사용자 정보 요청
            headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            HttpEntity<String> userInfoRequest = new HttpEntity<>(headers);
            ResponseEntity<String> userInfoResponse = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    userInfoRequest,
                    String.class
            );
            JsonNode userInfoNode = objectMapper.readTree(userInfoResponse.getBody());
            token = userInfoNode.path("id").asText();
            name = userInfoNode.path("properties").path("nickname").asText();
            System.out.println("User ID token: " + token);
            System.out.println("Nickname: " + name);
            User user = User.builder()
                    .token(token)
                    .name(name)
                    .build();
            userService.addUser(user);
            response.sendRedirect("http://localhost:3000/main?usertoken=" + token + "&name=" + URLEncoder.encode(name, "UTF-8") + "&access_token=" + accessToken);
//            response.sendRedirect("https://2024-1-ossp-1-checkoders-4.vercel.app/main?usertoken=" + token + "&name=" + URLEncoder.encode(name, "UTF-8") + "&access_token=" + accessToken);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @PostMapping("/{token}/{name}/dummy_user")
    public void dummy_user(@PathVariable String token,@PathVariable String name){
        User user= User.builder()
                .token(token)
                .name(name)
                .build();
        userService.addUser(user);

    }
    @GetMapping("/{token}/mainpage")
    public page1_main mainpage(@PathVariable String token) {
        User user = userService.getUser(token);
        String name = user.getName();
        List<Lecture> lectures = userService.getLecturesByUserToken(token, name);

        List<LocalDateTime> deadlines = userService.getDeadlines(token);
        List<LectureDTO> lectureDTOs = lectures.stream()
                .map(lecture -> LectureDTO.builder()
                        .lectureId(lecture.getId())
                        .name(lecture.getName())
                        .deadline(deadlines)
                        .madeby(lecture.getMadeby())
                        .madeby_name(lecture.getMadeby_name())
                        .course(lecture.getCourse())
                        .build())
                .collect(Collectors.toList());

        return page1_main.builder()
                .token(token)
                .name(userService.getUser(token).getName())
                .lectures(lectureDTOs)
                .build();
    }
    @PostMapping("/{token}/createlecture")
    public void createLecture(@PathVariable String token, @RequestParam String lectureName,@RequestParam String course) {
        User user = userService.getUser(token);
        String name = user.getName();
        Lecture lecture = Lecture.builder()
                .name(lectureName)
                .course(course)
                .madeby(token)
                .madeby_name(name)
                .build();
        userService.addLecture(lecture);
        Enrollment enrollment = Enrollment.builder()
                .lecture(lecture)
                .user(user)
                .build();
        userService.addOrUpdateEnrollment(enrollment);
    }

    @GetMapping("/{token}/getlectures")
    public List<Lecture> getLectures(@PathVariable String token) {
        User user = userService.getUser(token);
        String name = user.getName();
        return userService.getLecturesByUserToken(token, name);
    }

    @PostMapping("/{token}/participate")
    public void participate(@PathVariable String token, @RequestParam String lectureName) {
        User user = userService.getUser(token);
        Lecture lecture = userService.getLectureByName(lectureName);
        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .lecture(lecture)
                .build();
        userService.addOrUpdateEnrollment(enrollment);
    }

    @GetMapping("/{token}/{lectureId}/lecturepage")
    public page2_lecture lecturepage(@PathVariable String token, @PathVariable Long lectureId) {
        return userService.getPage2Lecture(token, lectureId);
    }

    // 문제만들때 사람에 따라 다르게
    @PostMapping("/{token}/{lectureId}/createAssignment")
    public void createAssignment(@PathVariable String token,
                                          @PathVariable Long lectureId,
                                          @RequestBody page4_makeProb page4_makeProb) {

        Lecture lecture=userService.getLectureById(lectureId);
        User user = userService.getUser(token);  //현재 user


        LectureAssignment lectureAssignment=LectureAssignment.builder()
                .title(page4_makeProb.getTitle())
                .description(page4_makeProb.getDescription())
                .lecture(lecture)
                .deadline(page4_makeProb.getDeadline())
                .hwTest1(page4_makeProb.getHwTest1())
                .hwTestAnswer1(page4_makeProb.getHwTestAnswer1())
                .hwTest2(page4_makeProb.getHwTest2())
                .hwTestAnswer2(page4_makeProb.getHwTestAnswer2())
                .hwTest3(page4_makeProb.getHwTest3())
                .hwTestAnswer3(page4_makeProb.getHwTestAnswer3())
                .hwTest4(page4_makeProb.getHwTest4())
                .hwTestAnswer4(page4_makeProb.getHwTestAnswer4())
                .hwTest5(page4_makeProb.getHwTest5())
                .hwTestAnswer5(page4_makeProb.getHwTestAnswer5())
                .build();

        if (page4_makeProb.getCourse().equals("0")){
            if (user.getToken().equals(lecture.getMadeby())){
                lectureAssignment.setProblem("0");
            }
            else{
                lectureAssignment.setProblem("1");
            }
        }
        else {
            lectureAssignment.setProblem("1");
        }
        userService.addLectureAssignment(token,lectureAssignment);
    }

    @GetMapping("/{token}/{lectureId}/{lectureAssignmentId}/assignmentpage")
    public page3_solve_1 assignmentpage(@PathVariable String token,
                                        @PathVariable Long lectureId,
                                        @PathVariable Long lectureAssignmentId) {
        // LectureAssignment 정보를 가져옵니다.
        LectureAssignment lectureAssignment = userService.getLectureAssignmentById(lectureAssignmentId);

        // page3_solve_1 객체에 필요한 정보를 설정합니다.
        page3_solve_1 solvePage = page3_solve_1.builder()
                .lectureId(lectureAssignment.getLecture().getId())
                .title(lectureAssignment.getTitle())
                .description(lectureAssignment.getDescription())
                .hwTest1(lectureAssignment.getHwTest1())
                .hwTestAnswer1(lectureAssignment.getHwTestAnswer1())
                .build();

        return solvePage;
    }

    @PostMapping("/{token}/{assignmentId}/submit")
    public String submit(@PathVariable String token,@PathVariable Long assignmentId,@RequestBody page3_solve_2 p) throws Exception {
        String code = URLDecoder.decode(p.getAnswer_text(), StandardCharsets.UTF_8.toString());

        User user = userRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LectureAssignment lectureAssignment = lectureAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        String feedback = codeFeedbackService.getCodeFeedback(code);

        Answer answer = Answer.builder()
                .answerText(p.getAnswer_text())
                .user(user)
                .gptFeedback(feedback)
                .correct(true)
                .assignment(lectureAssignment)
                .build();

        List<Map<String, String>> testCases = new ArrayList<>();
        testCases.add(Map.of("test", lectureAssignment.getHwTest1(), "answer", lectureAssignment.getHwTestAnswer1()));
        testCases.add(Map.of("test", lectureAssignment.getHwTest2(), "answer", lectureAssignment.getHwTestAnswer2()));
        testCases.add(Map.of("test", lectureAssignment.getHwTest3(), "answer", lectureAssignment.getHwTestAnswer3()));
        testCases.add(Map.of("test", lectureAssignment.getHwTest4(), "answer", lectureAssignment.getHwTestAnswer4()));
        testCases.add(Map.of("test", lectureAssignment.getHwTest5(), "answer", lectureAssignment.getHwTestAnswer5()));

        for (Map<String, String> testCase : testCases) {
            String test = testCase.get("test");
            String expectedAnswer = testCase.get("answer");
            if (!checkingService.compile(code, test, expectedAnswer)){
                answer.setCorrect(false);
                Answer savedAnswer = answerService.saveOrUpdateAnswer(answer);
                System.out.println("오답");
                return "오답";
            }
            Answer savedAnswer = answerService.saveOrUpdateAnswer(answer);
        }
        return "성공";
    }
}
