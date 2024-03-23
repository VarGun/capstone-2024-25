package capstone.allbom.routine.infrastructure.api;

import capstone.allbom.common.service.S3FileService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Random;
import java.util.Set;

@RequiredArgsConstructor
@Slf4j
@Component
public class RestTemplateRoutineRequester {

    private final S3FileService s3FileService;
    private final RestTemplate restTemplate;
    private static String ROUTINE_REQUEST_URL;

    public String requestRoutine() {
        ROUTINE_REQUEST_URL = s3FileService.getFile("routine.json");

        restTemplate.getMessageConverters()
                .add(new StringHttpMessageConverter(StandardCharsets.UTF_8));

        RequestEntity<Void> requestEntity = RequestEntity
                .get(URI.create(ROUTINE_REQUEST_URL))
                .accept(MediaType.TEXT_PLAIN)
                .build();

        String routineData = restTemplate
                .exchange(requestEntity, String.class)
                .getBody();

        log.info("routineData={}", routineData);
        return routineData;
    }

    public void getRoutineFields() {
        try {
            String routineData = requestRoutine();

            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(routineData);
            log.info("jsonObject={}", jsonObject);

            JSONObject exercises = (JSONObject)jsonObject.get("운동");
            log.info("exercises={}", exercises);
            String exercise = selectRandomRoutine(exercises);

            JSONObject rests = (JSONObject)jsonObject.get("휴식");
            String rest = selectRandomRoutine(rests);

            JSONObject growths = (JSONObject)jsonObject.get("성장");
            String growth = selectRandomRoutine(growths);

            JSONObject hobbies = (JSONObject)jsonObject.get("취미");
            String hobby = selectRandomRoutine(hobbies);

            JSONObject fruits = (JSONObject)jsonObject.get("과일");
            String fruit = selectRandomRoutine(fruits);

            JSONObject snacks = (JSONObject)jsonObject.get("간식");
            String snack = selectRandomRoutine(snacks);

            JSONObject eats = (JSONObject)jsonObject.get("식사");
            log.info("eats={}", eats);
            String eat = selectRandomRoutine(eats);

            if (eat.equals("간식 먹기")) {
                String replaceMent = snack + " 먹기";
                eat = eat.replace("간식 먹기", replaceMent);
            } else if (eat.equals("과일 먹기")) {
                String replaceMent = fruit + " 먹기";
                eat = eat.replace("과일 먹기", replaceMent);
            }
            log.info("newEat={}", eat);

        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    public String selectRandomRoutine(JSONObject jsonObject) {

        ArrayList<String> keysList = new ArrayList<>(jsonObject.keySet());

        Random random = new Random();
        int randomIndex = random.nextInt(keysList.size());

        String randomKey = keysList.get(randomIndex);
        log.info("randomKey={}", randomKey);

        return randomKey;
    }
}
