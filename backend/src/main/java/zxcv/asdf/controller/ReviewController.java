package zxcv.asdf.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zxcv.asdf.DTO.page6;
import zxcv.asdf.DTO.page6_review;
import zxcv.asdf.DTO.page7;
import zxcv.asdf.domain.Answer;
import zxcv.asdf.domain.Lecture;
import zxcv.asdf.domain.LectureAssignment;
import zxcv.asdf.domain.User;
import zxcv.asdf.service.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final UserService userService;
    private final LectureAssignmentService lectureAssignmentService;
    private final ChattingService chattingService;
    private final AnswerService answerService;
    private final ReviewService reviewService;

    /*@GetMapping("/{token}/{lectureassignmentId}")
    public page6 getReviewByAnswerId(@PathVariable String token,
                                     @PathVariable Long lectureassignmentId) {

        return reviewService.getPage6(token,lectureassignmentId);
    }*/

    @GetMapping("/page7/{token}/{membertoken}/{lectureId}")
    public page7 getReviewList(@PathVariable String token,
                               @PathVariable String membertoken,
                               @PathVariable Long lectureId) {

        return reviewService.getReviewList(token,membertoken, lectureId);
    }

}
