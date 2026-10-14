
package com.stylecart.controller;

import com.stylecart.entity.TailorRequest;
import com.stylecart.repository.TailorRequestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tailor-requests")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})

public class TailorRequestController {

    private final TailorRequestRepository tailorRequestRepository;

    public TailorRequestController(
            TailorRequestRepository tailorRequestRepository) {
        this.tailorRequestRepository = tailorRequestRepository;
    }

    @PostMapping
    public ResponseEntity<TailorRequest> createTailorRequest(
            @RequestBody TailorRequest tailorRequest) {

        tailorRequest.setId(null);
        tailorRequest.setStatus("PENDING");

        TailorRequest savedRequest =
                tailorRequestRepository.save(tailorRequest);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedRequest);
    }
}

