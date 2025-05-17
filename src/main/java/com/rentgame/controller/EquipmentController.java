package com.rentgame.controller;

import com.rentgame.model.Equipment;
import com.rentgame.repository.EquipmentRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    private final EquipmentRepository equipmentRepository;

    public EquipmentController(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @GetMapping
    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addEquipment(@Valid @RequestBody Equipment equipment) {
        if (equipmentRepository.findByName(equipment.getName()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("name", "Sprzęt o tej nazwie już istnieje"));
        }

        return ResponseEntity.ok(equipmentRepository.save(equipment));
    }
}
