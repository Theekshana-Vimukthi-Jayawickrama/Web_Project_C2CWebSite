package com.web_project.C2CECommerceSite.Admin;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SliderAdsRepository extends JpaRepository<SliderAds, Long> {
    SliderAds findById(long id);
}
