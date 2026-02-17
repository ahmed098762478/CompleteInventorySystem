    package com.example.project1.entity;

    import jakarta.persistence.*;

    @Entity
    @Table(name = "users")
    public class User {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(name = "name_user")
        private String nameUser;
        @Column(name = "phone")
        private String phone;
        @Column(name = "mail")
        private String mail;
        @Column(name = "password")
        private String password;



        private UserType userType;

        public void setUserType(UserType userType) {
            this.userType = userType;
        }

        public UserType getUserType() {
            return userType;
        }

        public void setId(int id) {
            this.id = id;
        }

        public void setNameUser(String nameUser) {
            this.nameUser = nameUser;
        }

        public void setPhone(String phone) {
            this.phone = phone;
        }

        public void setMail(String mail) {
            this.mail = mail;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public int getId() {
            return id;
        }

        public String getNameUser() {
            return nameUser;
        }

        public String getPhone() {
            return phone;
        }

        public String getMail() {
            return mail;
        }

        public String getPassword() {
            return password;
        }
    }
