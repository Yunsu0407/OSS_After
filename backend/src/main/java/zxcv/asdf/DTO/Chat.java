package zxcv.asdf.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Chat {
    String token;
    String text;
}
