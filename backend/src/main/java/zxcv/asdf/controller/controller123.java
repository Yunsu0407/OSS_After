package zxcv.asdf.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import zxcv.asdf.DTO.Chat;
import zxcv.asdf.DTO.page6;
import zxcv.asdf.DTO.page666;
import zxcv.asdf.service.*;

@RestController
@RequiredArgsConstructor
public class controller123 {

    private final UserService userService;
    private final LectureAssignmentService lectureAssignmentService;
    private final ChattingService chattingService;
    private final AnswerService answerService;
    private final ReviewService reviewService;

    @GetMapping("/aaa/{token}/{lectureassignmentId}")
    public page666 getReviewByAnswerId(@PathVariable String token,
                                       @PathVariable Long lectureassignmentId) {

        return reviewService.getPage666(token,lectureassignmentId);
    }

    @PostMapping("/chatting")
    public void saveChat(@RequestBody Chat chat) {
        reviewService.savechat(chat);
    }

}
