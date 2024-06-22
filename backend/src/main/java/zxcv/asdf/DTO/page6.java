package zxcv.asdf.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class page6 {
    private Long assignment_id;
    private String user_token;

    private String description;
    private String hw_test1;
    private String hw_test_answer1;


    private String answer_text;

    private String gpt_feedback;

    private Boolean correct;

    private List<page6_chat> chats;

}
