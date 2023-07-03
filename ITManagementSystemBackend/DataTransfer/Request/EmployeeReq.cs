﻿using BusinessObject.Enum;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class EmployeeReq
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public EnumList.Gender Gender { get; set; }
        [Required]
        public DateTime Dob { get; set; }
        [Required]
        public Enum.EnumList.Role Role { get; set; }
        [Required]
        public string CCCD { get; set; }
        [Required]
        public string Phone { get; set; }
        [Required]
        public string Address { get; set; }


    }
}
