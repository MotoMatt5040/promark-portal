from typing import Union

class Writer():

    def __init__(self):
        self.tnum = None
        self.qname = None
        self.title_text = None
        self.qtext = None
        self.rank = None
        self.qual = None
        self.base = None
        self.totals = None
        self.code_width = None
        self.start_column = None
        self.end_column = None
        self._column_text = None
        self.choice_codes = None
        self.max_choice = None
        self.choice_labels = None
        self.rows = None
        self.style = None

    def table_number(self):
        return f"TABLE {self.tnum}\n"

    def question_name(self):
        return f"T {self._qname}:\n"

    def write_title_text(self):
        title_text = self._title_text
        return f"T {title_text}\n"

    def question_text(self):
        qtext = self._qtext

        if self._title_text is not None:
            return f"{self.write_title_text()}" \
                   f"T /\n" \
                   f"T {qtext}\n"
        return f"T {qtext}\n" \
               f"T \n" \
               f"T /\n"

    def write_rank(self):
        if self._rank:
            return "O RANK\n"
        return ""

    def write_qual(self):
        if self._qual is not None:
            return f"Q {self._qual}\n"
        else:
            return ""

    def write_base(self):
        if self._base is None:
            return "R BASE==TOTAL SAMPLE ;ALL ;HP NOVP\n"
        else:
            return f"R BASE=={self._base.replace('=', '==')} ;ALL ;HP NOVP\n"

    def row_style(self):
        if self._totals is None:
            return self.write_rows()
        if not self._style:
            return (
                f"{self.write_rows()}"
            )
        else:
            return self.rows_inline()

    def total_rows(self) -> Union[list, None]:
        totals = []
        if self._totals is None:
            return None
        keys = list(self._totals.keys())
        if keys[0] == "REPUBLICAN":
            totals.append(f"R *D//S ({keys[0]} - {keys[2]}) ;NONE ;EX (R3-R5)\n")  # NEEDS TO BE keys[2] IN SOME CASES
        else:
            totals.append(f"R *D//S ({keys[0]} - {keys[1]}) ;NONE ;EX (R3-R4)\n")

        index = 1
        for key in keys:
            if self._code_width > 1:
                totals.append(f"R &UT- TOTAL {key} ;{self._column_text}{self._totals[key][0]}:{self._totals[key][1]})")
            else:
                totals.append(f"R &UT- TOTAL {key} ;{self._column_text}-{self._totals[key][0]}:{self._totals[key][1]}")
            totals[index] += "\n"
            index += 1
        return totals

    def rows_list(self) -> list:
        row_text = []
        index = 0
        rows = []
        for row in self._rows:
            indent = ""
            if self._totals is not None:
                for j in self._totals:
                    if j in row:
                        if not "UNSURE" in row and not "NO OPINION" in row and not "NO ANSWER" in row:
                            indent = "&AI2 "
                        continue

            rows.append(f"R {indent}{row}\n")
            row_text.append(f"R {indent}{row}\n")
            index += 1
        if self._max_choice < 2:
            pos = 0
            append = 0
            not_choices = []
            for i in range(len(self._choice_codes)):
                if i < len(self._choice_codes) - 1:
                    try:
                        if int(self._choice_codes[i]) != int(self._choice_codes[i + 1]) - 1:
                            if int(self._choice_codes[i]) - int(self._choice_codes[i + 1]) < -1:
                                if append == 0:
                                    not_choices.append(f"{self._choice_codes[i]}")
                                else:
                                    not_choices.append(f",{self._choice_codes[i]}")
                            else:
                                not_choices.append(f":{self._choice_codes[i]}")
                            pos = i
                            append += 1
                    except:
                        pass
                elif i - pos > 1 and append > 0:
                    not_choices.append(f",{self._choice_codes[pos + 1]}:{self._choice_codes[i]}")
                elif append == 0:
                    not_choices.append(f"{self._choice_codes[0]}:{self._choice_codes[i]}")
                else:
                    not_choices.append(f",{self._choice_codes[i]}")

            if not not_choices == []:
                if self._code_width > 1:
                    rows.append(f"R NO ANSWER ;NOT{self._column_text}{not_choices[0]}) ;NOR SZR\n")

                else:
                    rows.append(f"R NO ANSWER ;{self._column_text}N{not_choices[0]} ;NOR SZR\n")
        return rows

    def rows_inline(self):
        if self._qname == 'QPARTYID':
            return self.write_rows()
        totals = self.total_rows()
        rows = self.rows_list()
        final_rows = rows[4:]
        return (
            f"{totals[0]}"  # This is the D//S score
            f"{totals[1]}"  # This is the first total header
            f"{rows[0]}"  # Indented row info
            f"{rows[1]}"  # Indented row info
            f"{totals[2]}"  # This is the second total header
            f"{rows[2]}"  # Indented row info
            f"{rows[3]}"  # Indented row info
            + ''.join(final_rows)  # rows after total included rows, non-indented
        )

    def write_rows(self):
        rows = ""
        if self._totals is not None:
            for row in self.total_rows():
                rows += row
        for row in self.rows_list():
            rows += row
        return rows

    """-----------------------------------------------Create--------------------------------------------------"""

    def create_table(self) -> str:
        table = f"*\n" \
                f"{self.table_number()}" \
                f"{self.question_name()}" \
                f"{self.question_text()}" \
                f"{self.write_rank()}{self.write_qual()}{self.write_base()}" \
                f"{self.row_style()}"
        return table

    """-----------------------------------------------Create--------------------------------------------------"""

    def column_text(self):
        if self._code_width > 1:
            self._column_text = f"R({self._start_column}:{self._end_column},"
        else:
            self._column_text = f"{self._start_column}"

    @property
    def tnum(self) -> int:
        return self._tnum

    @property
    def qname(self) -> str:
        return self._qname

    @property
    def title_text(self) -> str:
        return self._title_text

    @property
    def qtext(self) -> str:
        return self._qtext

    @property
    def rank(self) -> bool:
        return self._rank

    @property
    def qual(self) -> str:
        return self._qual

    @property
    def base(self) -> str:
        return self._base

    @property
    def code_width(self) -> int:
        return self._code_width

    @property
    def start_column(self) -> int:
        return self._start_column

    @property
    def end_column(self) -> int:
        return self._end_column

    @property
    def choice_codes(self) -> list[int]:
        return self._choice_codes

    @property
    def choice_labels(self) -> list[str]:
        return self._choice_labels

    @property
    def max_choice(self) -> int:
        return self._max_choice

    @property
    def rows(self) -> list[str]:
        return self._rows

    @property
    def totals(self) -> list[str]:
        return self._totals.keys()

    @property
    def style(self) -> bool:
        return self._style

    """--------------------------------------------------SET--------------------------------------------------"""

    @tnum.setter
    def tnum(self, tnum: int):
        self._tnum = tnum

    @qname.setter
    def qname(self, qname: str):
        self._qname = qname

    @title_text.setter
    def title_text(self, title_text: str):
        if title_text != "":
            self._title_text = title_text
        else:
            self._title_text = None

    @qtext.setter
    def qtext(self, qtext: str):
        self._qtext = qtext

    @rank.setter
    def rank(self, rank: bool):
        self._rank = rank

    @qual.setter
    def qual(self, qual):
        self._qual = qual

    @base.setter
    def base(self, base: str):
        self._base = base

    @totals.setter
    def totals(self, totals: dict[str: list[int]]):
        self._totals = totals

    @code_width.setter
    def code_width(self, code_width: int):
        self._code_width = code_width

    @start_column.setter
    def start_column(self, start_column):
        self._start_column = start_column

    @end_column.setter
    def end_column(self, end_column):
        self._end_column = end_column

    @choice_codes.setter
    def choice_codes(self, choice_codes: Union[int, list[int]]):
        if type(choice_codes) == int:
            self._choice_codes = [choice_codes]
        else:
            self._choice_codes = choice_codes

    @max_choice.setter
    def max_choice(self, max_choice: int):
        self._max_choice = max_choice

    @choice_labels.setter
    def choice_labels(self, choice_labels: list[str]):
        self._choice_labels = choice_labels

    @rows.setter
    def rows(self, rows: list[str]):
        self._rows = rows

    @style.setter
    def style(self, style: bool):
        self._style = style
