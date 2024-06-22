package zxcv.asdf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import zxcv.asdf.domain.LectureAssignmentMapping;

import java.util.List;

public interface LectureAssignmentMappingRepository extends JpaRepository<LectureAssignmentMapping, Long> {
    List<LectureAssignmentMapping> findByLectureId(Long lectureId);
    List<LectureAssignmentMapping> findByLectureIdAndUserToken(Long lectureId, String userToken);

    @Query("SELECT lam.lecture.id FROM LectureAssignmentMapping lam WHERE lam.lectureAssignment.id = :lectureAssignmentId")
    Long findLectureIdByLectureAssignmentId(@Param("lectureAssignmentId") Long lectureAssignmentId);
}