package com.web_project.C2CECommerceSite.user;

import com.web_project.C2CECommerceSite.AddItems.Items;
import com.web_project.C2CECommerceSite.SendOTP.OTP;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "User")
public class User implements UserDetails {

    @Id
    @GeneratedValue(generator = "UUID")
    private UUID id;

    private  String email;
    private String password;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    private List<Items> items;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<UserRole> roles = new HashSet<>();

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name ="stu_otp", joinColumns = {@JoinColumn(name = "fk_stu")},
            inverseJoinColumns = {@JoinColumn(name = "fk_otp")})
    private OTP otp;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name ="Admin_Status", joinColumns = {@JoinColumn(name = "fk_Admin_Id")},
            inverseJoinColumns = {@JoinColumn(name = "fk_Admin_Status_Id")})
    private SuperAdminStatusMaintain superAdminMaintain;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinTable(name ="user_details", joinColumns = {@JoinColumn(name = "fk_user")},
            inverseJoinColumns = {@JoinColumn(name = "fk_userDetails")})
    private UserPersonalDetails userPersonalDetails;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(userRole -> new SimpleGrantedAuthority(userRole.getName().name()))
                .collect(Collectors.toList());
    }


    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
