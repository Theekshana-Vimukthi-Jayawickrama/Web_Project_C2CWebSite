package com.web_project.C2CECommerceSite;

import com.web_project.C2CECommerceSite.user.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

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

			User user = new User();
			user.setRoles(roles);
			user.setEmail("admin@gmail.com");
			user.setPassword(passwordEncoder.encode("admin1234"));
			userRepo.save(user);
		}
	}

}
