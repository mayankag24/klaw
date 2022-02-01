package com.kafkamgt.uiapi.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;

@Getter
@Setter
@ToString
public class RegisterUserInfoModel implements Serializable {

    @Size(min = 6, max = 300, message  = "UserName must be above 5 characters")
    @NotNull(message = "Username cannot be null")
    @Pattern(message = "Invalid username", regexp = "^[a-zA-Z0-9]{3,}$")
    private String username;

    private String pwd;

    private String team;

    private String role;

    @Size(min = 5, max = 50, message  = "Name must be above 4 characters")
    @NotNull(message = "Name cannot be null")
    @Pattern(message = "Invalid Full name.", regexp = "^[a-zA-z ]*$") //  Pattern a-zA-z and/or spaces.
    private String fullname;

    @Email(message = "Email should be valid")
    private String mailid;

    private String status;

    private Timestamp registeredTime;

    private String approver;

    private String registrationId;

    private int tenantId;

    private String tenantName;
}
