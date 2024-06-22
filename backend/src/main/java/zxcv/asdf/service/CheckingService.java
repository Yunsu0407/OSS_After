package zxcv.asdf.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zxcv.asdf.domain.Answer;
import zxcv.asdf.domain.LectureAssignment;
import zxcv.asdf.repository.AnswerRepository;
import zxcv.asdf.repository.LectureAssignmentRepository;

import javax.tools.*;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintStream;
import java.lang.reflect.Method;
import java.net.URI;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class CheckingService {

    public boolean compile(String sourceCode,String test,String expectedAnswer) throws Exception{

        String[] args = test.split(" ");
        Path path = Files.createTempDirectory("compile_output");
        JavaCompiler compiler = ToolProvider.getSystemJavaCompiler();
        StandardJavaFileManager fileManager = compiler.getStandardFileManager(null, null, null);

        Iterable<String> options = Arrays.asList("-d", path.toString());
        JavaFileObject file = new CheckingService.InMemoryJavaFileObject("Hello", sourceCode);
        Iterable<? extends JavaFileObject> compilationUnits = Arrays.asList(file);

        JavaCompiler.CompilationTask task = compiler.getTask(null, fileManager, null, options, null, compilationUnits);

        boolean success = task.call();
        if (!success) {
            return false;
        }

        URLClassLoader classLoader = URLClassLoader.newInstance(
                new URL[]{path.toUri().toURL()},
                this.getClass().getClassLoader()
        );

        Class<?> clazz = Class.forName("Hello", true, classLoader);
        Method method = clazz.getMethod("main", String[].class);
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        PrintStream originalOut = System.out;
        System.setOut(new PrintStream(bos));

        method.invoke(null, (Object) args);
        String result = bos.toString(StandardCharsets.UTF_8).trim();
        System.setOut(originalOut);

        System.out.println(result);
        System.out.println(expectedAnswer);

        try (Stream<Path> walk = Files.walk(path)) {
            walk.sorted(Comparator.reverseOrder())
                    .forEach(p -> {
                        try {
                            Files.delete(p);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    });
        }
        if (result.trim().equals(expectedAnswer)){return true;}
        else{return false;}
    }
    static class InMemoryJavaFileObject extends SimpleJavaFileObject {
        final String code;

        InMemoryJavaFileObject(String name, String code) {
            super(URI.create("string:///" + name.replace('.', '/') + Kind.SOURCE.extension), Kind.SOURCE);
            this.code = code;
        }

        @Override
        public CharSequence getCharContent(boolean ignoreEncodingErrors) {
            return code;
        }

    }
}