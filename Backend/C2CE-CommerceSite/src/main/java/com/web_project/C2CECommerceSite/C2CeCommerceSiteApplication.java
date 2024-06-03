package com.web_project.C2CECommerceSite;

import com.web_project.C2CECommerceSite.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

@SpringBootApplication
public class C2CeCommerceSiteApplication implements CommandLineRunner {

	@Autowired
	private final RoleRepository roleRepository;
	private final UserRepo userRepo;
	private final PasswordEncoder passwordEncoder;

    public C2CeCommerceSiteApplication(RoleRepository roleRepository, UserRepo userRepo, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }


    public static void main(String[] args) {
		SpringApplication.run(C2CeCommerceSiteApplication.class, args);
	}

	public void run(String... args){
		Optional<UserRole> adminAccount = roleRepository.findByName(Role.ADMIN);
		if(adminAccount.isEmpty()){

			Set<UserRole> roles = new HashSet<>();
			roles.add(UserRole.builder()
					.name(Role.ADMIN)
					.build());

			SuperAdminStatusMaintain superAdminMaintain = SuperAdminStatusMaintain.builder()
					.status(true)
					.build();
			UserPersonalDetails personalDetails = UserPersonalDetails.builder()
					.dob("0000/00/00")
					.telephone("00000000")
					.gender("NULL")
					.fullName("Super Admin")
					.nickName("Super Admin")
					.address("NULL")
					.build();
			User user = new User();
			user.setRoles(roles);
			user.setSuperAdminMaintain(superAdminMaintain);
			user.setEmail("admin@gmail.com");
			user.setPassword(passwordEncoder.encode("admin1234"));
			user.setUserPersonalDetails(personalDetails);
			userRepo.save(user);
		}



		List<UserRole> allRoles = roleRepository.findAll();
		List<Role> role = Arrays.stream(Role.values()).toList();
		for (Role userRole : role) {
			if(allRoles.stream().allMatch(userRoles -> userRoles.getName() != userRole )){
				UserRole userRoles = UserRole.builder()
						.name(userRole)
						.build();
				roleRepository.save(userRoles);
			}
		}

	}


}
