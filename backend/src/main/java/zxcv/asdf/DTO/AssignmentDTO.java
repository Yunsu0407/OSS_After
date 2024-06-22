package zxcv.asdf.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentDTO {
    private String title;
    private Long assignmentId;
    private String problem;
    private String description;
    private LocalDateTime deadline;
    private Boolean correct;
}
