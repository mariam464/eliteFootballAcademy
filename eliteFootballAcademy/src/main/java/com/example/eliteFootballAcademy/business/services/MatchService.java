package com.example.eliteFootballAcademy.business.services;

import com.example.eliteFootballAcademy.presentaion.dtos.MatchDto;
import java.util.List;

public interface MatchService {
    List<MatchDto> getAll();
    MatchDto getById(long id);
    MatchDto create(MatchDto matchDto);
    MatchDto update(long id, MatchDto updaterMatchDto);
    void delete(long id);
}
