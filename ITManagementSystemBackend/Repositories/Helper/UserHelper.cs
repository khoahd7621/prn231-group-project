using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Helper
{
    public class UserHelper
    {
        public static string GeneratedEmployeeCode(int count)
        {
            count++;


            var check = count.ToString().Length;
            if (check == 1)
            {
                return "SD000" + count;
            }
            else if (check == 2)
            {
                return "SD00" + count;
            }
            else if (check == 3)
            {
                return "SD0" + count;
            }
            return "SD" + count;
        }
        public static string GeneratedEmployeePassword(string fullName,DateTime dob)
        {
            List<string> words = fullName.Split(' ').ToList();
            var lastName = words[words.Count()-1];
            words.RemoveAt(words.Count()-1);
            words.Insert(0,lastName);
            string password="";
            for(int i = 0; i<words.Count()  ; i++)
            {
                password = password+ words[i].ToString();
            }
            password = password + "@";
            string[] date = dob.Date.ToString().Split(" ");
            string[] dobs = date[0].Split("/");
            for(int i =0;i<dobs.Count(); i++)
            {
                password += dobs[i];
            }
            password = password[0].ToString().ToUpper() + password.Substring(1);
            return password;

        }

    }
}
